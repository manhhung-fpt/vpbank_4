# Test Batch Credit Scoring API
# This script creates a sample CSV file and tests the batch scoring endpoint

import csv
import requests
import json
from datetime import datetime

# API endpoint
API_URL = "http://localhost:8000/api"

# Sample test data - 5 applications with different profiles
test_applications = [
    {
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "+84123456789",
        "age": 35,
        "employment_type": "Salaried",
        "annual_income": 800000000,
        "years_employed": 8,
        "existing_loans": 1,
        "credit_history_length": 96,
        "has_bank_account": True,
        "monthly_expenses": 30000000,
        "loan_amount": 200000000,
        "loan_purpose": "Home improvement"
    },
    {
        "name": "Trần Thị B",
        "email": "tranthib@example.com",
        "phone": "+84987654321",
        "age": 28,
        "employment_type": "Freelancer",
        "annual_income": 450000000,
        "years_employed": 4,
        "existing_loans": 0,
        "credit_history_length": 48,
        "has_bank_account": True,
        "monthly_expenses": 20000000,
        "loan_amount": 100000000,
        "loan_purpose": "Business expansion"
    },
    {
        "name": "Lê Văn C",
        "email": "levanc@example.com",
        "phone": "+84912345678",
        "age": 22,
        "employment_type": "Student",
        "annual_income": 150000000,
        "years_employed": 1,
        "existing_loans": 0,
        "credit_history_length": 12,
        "has_bank_account": True,
        "monthly_expenses": 10000000,
        "loan_amount": 50000000,
        "loan_purpose": "Education"
    },
    {
        "name": "Phạm Thị D",
        "email": "phamthid@example.com",
        "phone": "+84901234567",
        "age": 42,
        "employment_type": "Self-Employed",
        "annual_income": 650000000,
        "years_employed": 12,
        "existing_loans": 2,
        "credit_history_length": 144,
        "has_bank_account": True,
        "monthly_expenses": 25000000,
        "loan_amount": 300000000,
        "loan_purpose": "Business equipment"
    },
    {
        "name": "Hoàng Văn E",
        "email": "hoangvane@example.com",
        "phone": "+84923456789",
        "age": 30,
        "employment_type": "Salaried",
        "annual_income": 500000000,
        "years_employed": 5,
        "existing_loans": 1,
        "credit_history_length": 60,
        "has_bank_account": True,
        "monthly_expenses": 22000000,
        "loan_amount": 150000000,
        "loan_purpose": "Home purchase"
    }
]


def create_sample_csv():
    """Create sample CSV file for testing"""
    filename = "test_batch_applications.csv"
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = test_applications[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        writer.writerows(test_applications)
    
    print(f"✓ Created sample CSV file: {filename}")
    return filename


def test_download_template():
    """Test downloading the template"""
    print("\n=== Testing Template Download ===")
    
    try:
        response = requests.get(f"{API_URL}/credit/batch-template")
        
        if response.status_code == 200:
            # Save template
            with open("downloaded_template.csv", 'wb') as f:
                f.write(response.content)
            print("✓ Template downloaded successfully")
            print(f"  File saved as: downloaded_template.csv")
            return True
        else:
            print(f"✗ Failed to download template: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error downloading template: {str(e)}")
        return False


def test_batch_scoring(csv_file):
    """Test batch scoring endpoint"""
    print("\n=== Testing Batch Scoring ===")
    
    try:
        with open(csv_file, 'rb') as f:
            files = {'file': (csv_file, f, 'text/csv')}
            response = requests.post(f"{API_URL}/credit/batch-score", files=files)
        
        if response.status_code == 201:
            result = response.json()
            print("✓ Batch scoring successful!")
            print(f"\n=== Results ===")
            print(f"Total Applications: {result['total_applications']}")
            print(f"Processed: {result['processed']}")
            print(f"Success: {result['success']}")
            print(f"Failed: {result['failed']}")
            
            print(f"\n=== Summary Statistics ===")
            summary = result['summary']
            print(f"Average Score: {summary['average_score']:.1f}")
            print(f"High Risk: {summary['high_risk_count']}")
            print(f"Medium Risk: {summary['medium_risk_count']}")
            print(f"Low Risk: {summary['low_risk_count']}")
            print(f"Total Loan Amount: {summary['total_loan_amount']:,.0f} VND")
            print(f"Recommended Approvals: {summary['recommended_approvals']}")
            
            print(f"\n=== Individual Results ===")
            for idx, app_result in enumerate(result['results'], 1):
                print(f"\n{idx}. {app_result['name']}")
                print(f"   Credit Score: {app_result['credit_score']}")
                print(f"   Risk: {app_result['risk_category']}")
                print(f"   Approval Probability: {app_result['approval_probability']*100:.1f}%")
                print(f"   Recommendation: {app_result['recommendation']}")
            
            # Save results to JSON
            with open('batch_results.json', 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False, default=str)
            print(f"\n✓ Results saved to batch_results.json")
            
            return True
        else:
            print(f"✗ Batch scoring failed: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error during batch scoring: {str(e)}")
        return False


def test_health_check():
    """Test API health"""
    print("\n=== Testing API Health ===")
    
    try:
        response = requests.get(f"{API_URL}/health")
        
        if response.status_code == 200:
            health = response.json()
            print(f"✓ API is healthy")
            print(f"  Status: {health['status']}")
            print(f"  Service: {health['service']}")
            return True
        else:
            print(f"✗ API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Cannot connect to API: {str(e)}")
        print(f"  Make sure the backend is running on {API_URL}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("Batch Credit Scoring API Test Suite")
    print("=" * 60)
    
    # Check API health first
    if not test_health_check():
        print("\n⚠ Please start the backend server first:")
        print("  cd backend")
        print("  python main.py")
        return
    
    # Test template download
    test_download_template()
    
    # Create test CSV
    csv_file = create_sample_csv()
    
    # Test batch scoring
    test_batch_scoring(csv_file)
    
    print("\n" + "=" * 60)
    print("Test suite completed!")
    print("=" * 60)


if __name__ == "__main__":
    main()

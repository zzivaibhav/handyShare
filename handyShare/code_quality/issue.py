import os
import sys
import requests
from csv2md import table
import csv

def main():
    # Get command line arguments
    if len(sys.argv) != 3:
        print("Usage: python issue.py <commit_hash> <github_pat>")
        sys.exit(1)
    
    commit = sys.argv[1]
    pat = sys.argv[2]  # Get PAT directly from command line argument
    
    # Define the path to smells directory
    current_dir = os.getcwd()
    path_to_smells = os.path.join(current_dir, "report")
    
    # Debug information
    print(f"Current working directory: {current_dir}")
    print(f"Looking for smell files in: {path_to_smells}")
    
    # Verify directory exists
    if not os.path.exists(path_to_smells):
        print(f"Error: Directory not found: {path_to_smells}")
        print("Directory contents:", os.listdir(current_dir))
        sys.exit(1)
    
    # Get list of CSV files
    try:
        smell_files = [f for f in os.listdir(path_to_smells) 
                      if os.path.isfile(os.path.join(path_to_smells, f)) 
                      and f.endswith(".csv")]
        print(f"Found {len(smell_files)} CSV files: {smell_files}")
    except Exception as e:
        print(f"Error listing directory contents: {e}")
        sys.exit(1)
    
    # Setup GitHub API headers
    headers = {
        "Authorization": f"Bearer {pat}",
        "Accept": "application/vnd.github+json",
    }
    
    # Process each smell file
    for sf in smell_files:
        try:
            file_path = os.path.join(path_to_smells, sf)
            print(f"Processing file: {file_path}")
            
            with open(file_path) as csv_file:
                list_smells = list(csv.reader(csv_file))
            
            # Generate markdown table
            raw_md = table.Table(list_smells).markdown()
            
            # Create issue title
            title = f"{sf.replace('.csv', '')} for commit - {commit}"
            
            # Prepare request body
            body = {
                "title": title,
                "body": raw_md
            }
            
            # Create GitHub issue
            response = requests.post(
                "https://api.github.com/repos/CSCI5308/course-project-g02/issues",
                headers=headers,
                json=body
            )
            
            # Check response
            if response.status_code == 201:
                print(f"Successfully created issue for {sf}")
            else:
                print(f"Failed to create issue for {sf}. Status code: {response.status_code}")
                print(f"Response: {response.text}")
                raise Exception(f"GitHub API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"Error processing file {sf}: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()

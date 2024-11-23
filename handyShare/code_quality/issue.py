import os
import sys
import requests
from csv2md import table
import csv
import math

def chunk_data(data, max_rows=500):
    """Split data into chunks that won't exceed GitHub's size limit."""
    return [data[i:i + max_rows] for i in range(0, len(data), max_rows)]

def create_github_issue(headers, title, body, attempt=1):
    """Create a GitHub issue with error handling and retry logic."""
    response = requests.post(
        "https://api.github.com/repos/CSCI5308/course-project-g02/issues",
        headers=headers,
        json={"title": title, "body": body}
    )
    
    if response.status_code == 201:
        return True
    elif response.status_code == 422 and attempt == 1:
        # If first attempt fails due to size, try with smaller chunk
        return False
    else:
        print(f"Failed to create issue. Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return False

def main():
    # Get command line arguments
    if len(sys.argv) != 3:
        print("Usage: python issue.py <commit_hash> <github_pat>")
        sys.exit(1)
    
    commit = sys.argv[1]
    pat = sys.argv[2]
    
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
    
    # Setup GitHub API headers
    headers = {
        "Authorization": f"Bearer {pat}",
        "Accept": "application/vnd.github+json",
    }
    
    # Get list of CSV files
    smell_files = [f for f in os.listdir(path_to_smells) 
                  if os.path.isfile(os.path.join(path_to_smells, f)) 
                  and f.endswith(".csv")]
    
    # Process each smell file
    for sf in smell_files:
        try:
            file_path = os.path.join(path_to_smells, sf)
            print(f"Processing file: {file_path}")
            
            # Read CSV file
            with open(file_path) as csv_file:
                all_smells = list(csv.reader(csv_file))
            
            if len(all_smells) <= 1:  # Skip if only headers or empty
                print(f"Skipping {sf} - No data found")
                continue
                
            headers_row = all_smells[0]
            data_rows = all_smells[1:]
            
            # Split data into chunks
            chunks = chunk_data(data_rows)
            total_chunks = len(chunks)
            
            # Create issues for each chunk
            for i, chunk in enumerate(chunks, 1):
                # Create full data with headers
                chunk_data = [headers_row] + chunk
                
                # Generate markdown table
                raw_md = table.Table(chunk_data).markdown()
                
                # Create issue title with part number if multiple parts
                base_title = f"{sf.replace('.csv', '')} for commit - {commit}"
                title = f"{base_title} (Part {i}/{total_chunks})" if total_chunks > 1 else base_title
                
                # Add summary information
                summary = f"""
### Summary
- Total Records: {len(data_rows)}
- Current Chunk: {len(chunk)} records
- Part {i} of {total_chunks}

---

"""
                body = summary + raw_md
                
                # Try to create the issue
                if create_github_issue(headers, title, body):
                    print(f"Successfully created issue {i}/{total_chunks} for {sf}")
                else:
                    print(f"Failed to create issue {i}/{total_chunks} for {sf}")
                    
        except Exception as e:
            print(f"Error processing file {sf}: {e}")
            continue  # Continue with next file instead of exiting

if __name__ == "__main__":
    main()

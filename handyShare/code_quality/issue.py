import subprocess

# Install required dependencies
dependencies = [
    "certifi==2022.12.7",
    "charset-normalizer==3.0.1",
    "csv2md==1.1.2",
    "idna==3.4",
    "requests==2.28.2",
    "urllib3==1.26.14",
]
subprocess.run(["pip", "install", *dependencies])

import os
import sys
import requests
from csv2md import table
import csv
import glob

# Ensure the correct arguments are passed
if len(sys.argv) < 3:
    print("Usage: python3 issue.py <commit_hash> <personal_access_token>")
    sys.exit(1)

commit = sys.argv[1]
pat = sys.argv[2]

# Print current working directory and environment
print("Current Working Directory:", os.getcwd())
print("Environment Variables:")
for key, value in os.environ.items():
    if 'PATH' in key or 'GITHUB' in key:
        print(f"{key}: {value}")

# Predefined list of expected smell files
expected_smell_files = [
    "ArchitectureSmells.csv",
    "DesignSmells.csv",
    "TestSmells.csv",
    "ImplementationSmells.csv",
    "TestabilitySmells.csv",
]

# Explicitly set the path to the report directory
path_to_smells = './handyShare/code_quality/report'

# Debug: Print contents of the directory
print(f"Contents of {path_to_smells}:")
for item in os.listdir(path_to_smells):
    print(item)

# Find all CSV files in the report directory
smell_files = []
for filename in expected_smell_files:
    file_path = os.path.join(path_to_smells, filename)
    print(f"Checking file: {file_path}")
    if os.path.exists(file_path):
        print(f"Found file: {file_path}")
        smell_files.append(file_path)
    else:
        print(f"Warning: {filename} not found in {path_to_smells}")

print("Smell files found:", smell_files)

# GitHub API endpoint
headers = {
    "Authorization": f"Bearer {pat}",
    "Accept": "application/vnd.github+json",
}
URL = "https://api.github.com/repos/CSCI5308/course-project-g02/issues"

# Iterate through the smell files
for smell_file_path in smell_files:
    # Print file contents for debugging
    print(f"\nProcessing file: {smell_file_path}")
    with open(smell_file_path, 'r') as f:
        print("File contents:")
        print(f.read())
    
    # Reset file pointer
    with open(smell_file_path) as csv_file:
        list_smells = list(csv.reader(csv_file))
    
    raw_md = table.Table(list_smells).markdown()
    
    # Prepare issue title and body
    filename = os.path.basename(smell_file_path)
    title = str(filename).replace(".csv", "") + " for commit - " + str(commit)[:7]
    body = {"title": title, "body": raw_md, "labels": ["Designite", "Smells"]}
    
    # Check if a similar issue already exists
    issues = requests.get(URL, headers=headers).json()
    create_issue = True
    
    for issue in issues:
        if issue.get("title") == title or issue.get("body") == raw_md:
            print(f"Issue already exists: {issue['html_url']}, {title}. Skipping...")
            create_issue = False
            break
    
    # Create the GitHub issue if it doesn't exist
    if create_issue:
        github_output = requests.post(URL, headers=headers, json=body)
        if github_output.status_code == 201:
            print(f"Issue created: {github_output.json()['html_url']}")
        else:
            print("Failed to create issue. Response:", github_output.json())
            raise Exception("Error while creating GitHub issue")

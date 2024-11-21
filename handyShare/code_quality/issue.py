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

# Ensure the correct arguments are passed
if len(sys.argv) < 3:
    print("Usage: python3 issue.py <commit_hash> <personal_access_token>")
    sys.exit(1)

commit = sys.argv[1]
pat = sys.argv[2]

# Path to the smell reports
path_to_smells = "./handyShare/code_quality/report/"
smell_files = [
    "ArchitectureSmells.csv",
    "DesignSmells.csv",
    "TestSmells.csv",
    "ImplementationSmells.csv",
    "TestabilitySmells.csv",
]

# GitHub API endpoint
headers = {
    "Authorization": f"Bearer {pat}",
    "Accept": "application/vnd.github+json",
}
URL = "https://api.github.com/repos/CSCI5308/course-project-g02/issues“

# Iterate through the smell files
for sf in smell_files:
    smell_file_path = os.path.join(path_to_smells, sf)

    # Check if the smell file exists
    if not os.path.exists(smell_file_path):
        print(f"Warning: {sf} not found in {path_to_smells}. Skipping...")
        continue

    # Read the smell file and generate Markdown
    with open(smell_file_path) as csv_file:
        list_smells = list(csv.reader(csv_file))

    raw_md = table.Table(list_smells).markdown()

    # Prepare issue title and body
    title = str(sf).replace(".csv", "") + " for commit - " + str(commit)[:7]
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

import os
import sys
import requests
from csv2md import table
import csv

commit = sys.argv[1]
pat = os.environ.get("SAMARTH_PAT")
path_to_smells = "./handyShare/code_quality/report/"
smell_files = [f for f in os.listdir(path_to_smells) if os.path.isfile(
    os.path.join(path_to_smells, f)) and str(f).strip().endswith(".csv")]

headers = {
    "Authorization": f"Bearer {pat}",
    "Accept": "application/vnd.github+json",
}
for sf in smell_files:

    with open(os.path.join(path_to_smells, sf)) as csv_file:
        list_smells = list(csv.reader(csv_file))

    raw_md = table.Table(list_smells).markdown()

    title = str(sf).replace(".csv", "")+" for commit - "+str(commit)
    body = {
        "title": title,
        "body": raw_md
    }
    github_output = requests.post(
        f"https://api.github.com/repos/MootezSaaD/lab-8-code-smells/issues", headers=headers, json=body)
    if not github_output.status_code == 201:
        raise Exception

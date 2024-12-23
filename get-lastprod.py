import os, requests, argparse

env_file = os.getenv('GITHUB_ENV')

parser = argparse.ArgumentParser()
parser.add_argument(
    "--gh-token",
    help="Github token",
    type=str,
    default="",
    required=False
)
args = parser.parse_args()

headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': f'Bearer {args["gh-token"]}',
    'X-GitHub-Api-Version': '2022-11-28',
}
req = requests.get(
    'https://api.github.com/repos/DanYellow/test/actions/workflows/133863234/runs?status=completed&per_page=2',
    headers=headers
)

response = req.json()
print(response)
# with open(env_file, "a") as myfile:
#     myfile.write(f"LAST_COMPLETED_RUN_ID={response.workflow_runs[0].id}")

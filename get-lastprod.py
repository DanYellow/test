import os, argparse
from urllib.request import Request, urlopen, json

env_file = os.getenv('GITHUB_ENV')

parser = argparse.ArgumentParser()
parser.add_argument(
    "--gh_token",
    help="Github token",
    type=str
)
args = parser.parse_args()
print(args)
headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': f'Bearer {args.gh_token}',
    'X-GitHub-Api-Version': '2022-11-28',
}
req = Request(
    'https://api.github.com/repos/DanYellow/test/actions/workflows/133863234/runs?status=completed&per_page=2'
)
req.add_header('Accept', 'application/vnd.github+json')
req.add_header('Authorization',  f'Bearer {args.gh_token}')
req.add_header('X-GitHub-Api-Version', '2022-11-28')

content = urlopen(req).read()


# response = req.json()
print(content)
# with open(env_file, "a") as myfile:
#     myfile.write(f"LAST_COMPLETED_RUN_ID={response.workflow_runs[0].id}")

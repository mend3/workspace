import hashlib
import unicodedata
import os
import subprocess
import re


def sha256_hash(text: str):
    """Return a SHA256 hash of the normalized text."""
    normalized = unicodedata.normalize("NFC", text.strip())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s.,!?-]", "", text)
    return text.strip()


def get_git_root(path):
    """Return the git root directory for the given path, or None if not in a git repo."""
    dir_path = path if os.path.isdir(path) else os.path.dirname(path)
    try:
        return (
            subprocess.check_output(
                ["git", "rev-parse", "--show-toplevel"],
                cwd=dir_path,
                stderr=subprocess.DEVNULL,
            )
            .decode("utf-8")
            .strip()
        )
    except Exception:
        return None


def get_git_info(repo_path):
    """Return a dict with current git commit, branch, tag, and dirty state for the given repo path."""

    def run_git_cmd(args):
        try:
            return (
                subprocess.check_output(
                    ["git"] + args, cwd=repo_path, stderr=subprocess.DEVNULL
                )
                .decode("utf-8")
                .strip()
            )
        except Exception:
            return None

    repo_name = os.path.basename(os.path.abspath(repo_path))
    origin_url = run_git_cmd(["config", "--get", "remote.origin.url"])

    return {
        "git_commit": run_git_cmd(["rev-parse", "HEAD"]),
        "git_branch": run_git_cmd(["rev-parse", "--abbrev-ref", "HEAD"]),
        "git_tag": run_git_cmd(["describe", "--tags", "--exact-match"]),
        "git_is_dirty": bool(run_git_cmd(["status", "--porcelain"])),
        "git_repo_name": repo_name,
        "git_origin_url": origin_url,
    }


def format_git_info(git_info):
    """Format git info dict as a string for context."""
    if not git_info or not git_info.get("git_commit"):
        return "git_info: not a git repository"
    return "\n".join(f"{k}: {v}" for k, v in git_info.items() if v is not None)

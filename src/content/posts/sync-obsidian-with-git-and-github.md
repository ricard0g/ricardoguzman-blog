---
layout: "../../layouts/PostLayout.astro"
slug: "sync-obsidian-with-git-and-github"
title: "Sync Obsidian with Git & GitHub"
pubDateString: "2025, August 20th"
pubDate: 2025-08-20
tags: ["Obsidian", "Git", "Github", "Linux", "MacOS"]
author: "Ricardo Guzman"
image: "https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg"
description: "Follow this blog post to setup your Obsidian Vault syncing with Git & GitHub."
---

I've been looking a way to sync my Obsidian Vault between my Mac and Linux machine.

Yeah, I know that there's Dropbox, but I knew that **_Git/GitHub_** was an alternative that has two strong points for me:

1. **Free**
2. **I just knew that a Version Control System was possible and I wanted that**

So let's setup Git/GitHub with Obsidian.

## Prerequisites

- **GitHub Account**
- **GitHub Personal Access Token**: This token is important since is the password that you'll be asked for when Authenticating on Github when pushing your changes.
- **Git**: Version Control System that you'll need to install on your machine. [Git Download Page](https://git-scm.com/downloads)
- **Git Client (Optional)**: You could install GUI clients like [GitHub Desktop](https://github.com/apps/desktop).
- **Obsidian**

## Setting Up Syncing System

### 1. Create a Private GitHub Repo

First we'll need a remote repository to store our vault.

1. Log In to your GitHub account
2. Click _"New"_ to create a new and give a name to it
3. **Crucially, set the repo to _"Private"_** to ensure that your secrets are safe
4. You can leave the rest of options as they are and click "Create Repository"

### 2. Initialize a Git Repository in Your Obsidian Vault

Now we need to convert our Obsidian Vault into a Git repo and connect it to GitHub.

1. Open a terminal window and go to your Obsidian's Vault Directory. You can usually find the path in Obsidian by right-clicking on the vault name in the left sidebar and selecting "Show in system explorer" (or similar)
2. Run these commands:

```bash
# Initialize the git repo
git init

# IMPORTANT -> Create a .gitignore file. this will save you A LOT of headaches trust me.

# PD: This is the one I have and works for me, of course if you think that other files should be ignored you're free to ignore them

echo ".obsidian/workspace.json\n.obsidian/workspaces.json\n.obsidian/plugins/obsidian-git/data.json\n.trash/" > .gitignore

# IMPORTANT -> Add the .gitignore first
git add .gitignore
git commit -m "chore: Add .gitignore"

# Now is when you add all your notes and files
git add .

# Now is when we commit our entire vault
git commit -m "Initial Vautl Commit"

# Connect local vault to your created GitHub Remote Repo (see instructions below to find your github repo url)
git remote add origin "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"

git branch -M main

git push -u origin main
```

To find your GitHub repo URL:

1. Go to your GitHub Account and search your repo by the name you gave it
2. Once in your repo go to the blue button _"Code"_
3. Copy the URL that's in the _"HTTPS"_ tab

That's the URL of your GitHub repo.

Now open the vault by opening Obsidian and then _"Open Folder as Vault"_ and you're in your Obsidian Vault with Git.

### 3. Install & Configure the Obsidian Git Plugin

Let's download and configure the plugin that will make things possible.

1. Go to "Community Plugins" and search for "Git"
2. You should install the one created by _"Vinzent (Denis Olehov)"_
3. Install and enable the blueprint.
4. Now that you have enabled the plugin, you're free to configure things as you prefer. I recommend these two:
   1. **Pull On Startup**
   2. **Vault Backup Interval**: select the intervals you want to pull and push changes.

## Getting your GitHub Vault on a different machine

Perfect, you have your Vault synced with Git/GitHub, now let's get this vault on another machine since that's the point of this process anyway.

1. Open your terminal window in your machine and go to the location you want your Obsidian vault to be in.
2. Clone the repository. Run this command:

```Bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

_This is the same repo URL from before_

3. Open in Obsidian:
   - Launch Obsidian
   - Choose _"Open Folder as Vault"_ and select your newly cloned repo
4. Install and enable the **Git** plugin and configure it the same way.

## Conclusion

That's it for this process.

That's the process I followed and now I'm really happy with my syncing through GitHub.

Enjoy your free syncing.

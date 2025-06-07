# Internal Notes

## docker

https://github.com/veggiemonk/awesome-docker/blob/master/README.md
https://github.com/bcicen/ctop
https://github.com/jesseduffield/lazydocker#installation

## MySQL

Grant privileves to a user:

```bash
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER$'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```


## Cuda WSL

[Install on WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#installing-docker)

https://docs.nvidia.com/ai-enterprise/deployment/vmware/latest/docker.html

https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/sample-workload.html#running-a-sample-workload

https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-the-nvidia-container-toolkit


```bash
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```

## zsh

https://gist.github.com/n1snt/454b879b8f0b7995740ae04c5fb5b7df

### nvm-auto-use

https://github.com/Sparragus/zsh-auto-nvm-use

### fzf-tab

https://gist.github.com/seungjulee/d72883c193ac630aac77e0602cb18270

### autoenv

```bash
curl -#fLo- 'https://raw.githubusercontent.com/hyperupcall/autoenv/main/scripts/install.sh' | sh
```

## PowerLine Fonts

https://github.com/powerline/fonts?tab=readme-ov-file


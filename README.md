# Salient Startpage

![./themes/demo/SalientStartpage.gif](https://github.com/qcasey/SalientStartpage/blob/main/themes/demo/SalientStartpage.gif)

A startpage with **light/dark mode**, **automatic favicons per site**, and **retained search bar focus**.

For the latter Chromium new tab focus / custom new tab page, you'll want [these chromium patches](https://github.com/qcasey/chromium-patches). A little advanced, but worth it!

This is compatible with [Homer](https://github.com/bastienwirtz/homer), you can copy/paste your sites/urls/icons from there to `config.yaml`.

The startpage itself can be rendered to an `.html` file with a directory of images.

# Run with Docker

Clone, build, and run the container:

```bash
git clone https://github.com/qcasey/SalientStartpage && cd SalientStartpage
docker build -t salient-startpage .
docker run -p 8080:80 --name salient-startpage salient-startpage
```

Just want the HTML/CSS? Keep the container running like above, and copy the files out:

```bash
docker cp $(docker ps -aqf "name=salient-startpage"):/usr/share/nginx/html ./public
```

You should be able to point a browser to ```./public```

# Configuring

Rebuild the container above after making changes to ```config.yml```. The docker build step will fetch favicons to the bookmarks you define, and use Hugo to render the final version of your startpage.

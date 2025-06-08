# Base image (Google Chrome 102.0.5005.61)
FROM dist AS chrome
ENV CHROME_VERSION "google-chrome-stable"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update; apt-get clean
# Install wget.
RUN apt-get install -y wget
RUN apt-get install -y gnupg
# Set the Chrome repo.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
# Install Chrome.
RUN apt-get update && apt-get -y install google-chrome-stable

# # Create a non-root user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser

# Set the non-root user as default
USER pptruser


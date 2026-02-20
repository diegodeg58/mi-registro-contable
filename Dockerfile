FROM node:22

RUN apt-get update && apt-get install -y \
  libnspr4 libnss3 libxss1 libasound2 libgtk-3-0 libx11-xcb1 libxcomposite1 libxdamage1 \
  libxrandr2 libgbm1 libatk1.0-0 libpangocairo-1.0-0 libcups2 libgconf-2-4 ca-certificates \
  fonts-liberation libappindicator3-1 libatk-bridge2.0-0 libx11-6 libxcb1 libxext6 libxfixes3 libxi6 xdg-utils \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /home/node/app

USER node

CMD ["bash", "-c", "npm run dev"]

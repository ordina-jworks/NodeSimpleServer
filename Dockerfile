FROM node:boron

EXPOSE 7080 7081

RUN git clone https://github.com/ordina-jworks/NodeSimpleServer.git nss

WORKDIR nss
RUN npm install forever -g && npm install -g bower && npm install -g typescript
RUN npm install
RUN bower install --allow-root && tsc -p ./

CMD ["forever", "src/app.js"]

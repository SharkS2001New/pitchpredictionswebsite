# Next.js frontend — Alpine + Node (same pattern as freewinningtips / centrix-erp-frontend-web)
FROM alpine

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY package.json package-lock.json ./
RUN apk add --no-cache nodejs npm && npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

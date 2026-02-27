FROM docker.n8n.io/n8nio/n8n:latest

# Render provides PORT dynamically
ENV N8N_PORT=$PORT

EXPOSE 5678
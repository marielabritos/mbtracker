import os
import sys
import asyncio
import uvicorn

# Asegurar que el directorio raíz de backend esté en sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Iniciando servidor backend MBTracker en http://127.0.0.1:{port}")
    print(f"Documentación OpenAPI Swagger en http://127.0.0.1:{port}/docs")
    config = uvicorn.Config(app, host="127.0.0.1", port=port, log_level="info")
    server = uvicorn.Server(config)
    asyncio.run(server.serve())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from models.database import engine, Base
from pipeline import VectorStore, EmbeddingManager, RAGRetrieval, RAGLLM, TextChunker
import os
from langchain_community.document_loaders import DirectoryLoader, PyMuPDFLoader
###TABLE BNAO
Base.metadata.create_all(bind=engine)

## FastAPI app bnao
app=FastAPI(title="Medical Rag API",
            description="Production ready Medical RAG API built with FastAPI,PostgreSQL,Docker,Groq and Langchain ",
            version="1.0.0")
## CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["http://localhost:5173"], # Your React URL
    allow_credentials=True,
)

##router setup

app.include_router(auth_router,prefix="/api")
app.include_router(chat_router,prefix="/api")

# STartup Rag Pipeline load karo

@app.on_event("startup")
async def startup():
    print("[API] Starting RAG Pipeline...")

    embedding_manager = EmbeddingManager()
    vector_store = VectorStore()
    retriever = RAGRetrieval(vector_store, embedding_manager)
    rag = RAGLLM()
    
    # Agar vector store empty hai to index karo
    if vector_store.collection.count() == 0:
        print("[API] Vector store empty, indexing documents...")
        loader = DirectoryLoader(
            "./data/pdf",
            glob="**/*.pdf",
            loader_cls=PyMuPDFLoader
        )
        documents = loader.load()
        chunker = TextChunker()
        chunks = chunker.split(documents) # Chunks are list of Document objects
        
        # Sahi logic: Text nikaal kar embedding banani hai
        texts = [chunk.page_content for chunk in chunks]
        embeddings = embedding_manager.generate_embedding(texts)
        
        # Ab 'chunks' (metadata ke liye) aur 'embeddings' dono bhej rahe hain
        vector_store.add_embeddings(chunks, embeddings)
        print("[API] Indexing complete!")
        
    app.state.retriever = retriever
    app.state.rag = rag
    print("[API] RAG Pipeline ready!")
        
        # Heath check endpoint
    
@app.get("/health")
async def health_check():
    return {"status": "running",
            "version" :"1.0.0",
            "uptime": "24 hours"}

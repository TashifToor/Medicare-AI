import os
import uuid
import warnings
import logging
import numpy as np
import chromadb
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import DirectoryLoader, PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq

warnings.filterwarnings("ignore")
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
load_dotenv()

# ── Document Loader ──────────────────────────────────────────────────────────
dir_loader_pdf = DirectoryLoader(
    "./data/pdf",
    glob="**/*.pdf",
    loader_cls=PyMuPDFLoader,
    show_progress=True
)

# ── Text Chunker ─────────────────────────────────────────────────────────────
class TextChunker:
    def __init__(self, chunk_size=500, chunk_overlap=50):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    def split(self, documents):
        chunks = self.text_splitter.split_documents(documents)
        print(f"[Chunker] {len(chunks)} chunks created.")
        return chunks

# ── Embedding Manager ────────────────────────────────────────────────────────
class EmbeddingManager:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):  # lowercase
        self.model = SentenceTransformer(model_name)

    def generate_embedding(self, texts: list) -> np.ndarray:
        return self.model.encode(texts)

# ── Vector Store ─────────────────────────────────────────────────────────────
class VectorStore:
    def __init__(self, collection_name="medical", persist_directory="./data/vector_store"):
        self.collection_name = collection_name
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Medical PDF vectors"}
        )
        print(f"[VectorStore] Ready — {self.collection.count()} chunks stored.")

    def add_embeddings(self, documents, embeddings: np.ndarray):
        if len(documents) != len(embeddings):
            raise ValueError("Documents and embeddings count must match.")

        ids, metadatas, documents_text, embedding_list = [], [], [], []

        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            ids.append(f"doc_{uuid.uuid4().hex[:8]}_{i}")
            metadata = dict(doc.metadata)
            metadata['source_idx'] = i
            metadata['content_length'] = len(doc.page_content)
            metadatas.append(metadata)
            documents_text.append(doc.page_content)
            embedding_list.append(embedding.tolist())  # ek embedding

        # Loop ke baad ek baar add karo
        self.collection.add(
            ids=ids,
            metadatas=metadatas,
            documents=documents_text,
            embeddings=embedding_list
        )
        print(f"[VectorStore] {len(documents)} chunks stored.")

# ── RAG Retrieval ────────────────────────────────────────────────────────────
class RAGRetrieval:
    def __init__(self, vector_store: VectorStore, embedding_manager: EmbeddingManager):
        self.vector_store = vector_store
        self.embedding_manager = embedding_manager

    def retrieval(self, query: str, top_l: int = 3, score_threshold: float = 0.0):
        query_embedding = self.embedding_manager.generate_embedding([query])[0]
        results = self.vector_store.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_l,
        )

        retrieved_docs = []
        if results['documents'] and results['documents'][0]:
            for i, (doc_id, metadata, document, distance) in enumerate(zip(
                results['ids'][0],
                results['metadatas'][0],
                results['documents'][0],
                results['distances'][0]
            )):
                similarity_score = 1 / (1 + distance)
                if similarity_score >= score_threshold:  # >= sahi hai
                    retrieved_docs.append({
                        "id": doc_id,          # string quotes
                        "metadata": metadata,
                        "content": document,
                        "similarity_score": similarity_score,
                        "rank": i + 1,
                    })
        else:
            print("No relevant documents found.")

        return retrieved_docs

# ── RAG LLM ──────────────────────────────────────────────────────────────────
class RAGLLM:
    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=1024
        )

    def ask(self, query: str, retriever: RAGRetrieval, top_l: int = 3) -> str:
        retrieved_docs = retriever.retrieval(query, top_l=top_l)
        context = "\n\n".join([doc['content'] for doc in retrieved_docs])

        if not context:  # context nahi mila
            return "Sorry, I couldn't find any relevant information."

        prompt = f"""You are a Senior Doctor with extensive medical knowledge.
Answer the question precisely based on the context provided.
If context is insufficient, say you don't have enough information.You also act like real doctor and give answer in a human like way. 

Context: {context}

Question: {query}

Answer:"""

        response = self.llm.invoke(prompt)
        return response.content

# ── Main Pipeline ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Initialize
    embedding_manager = EmbeddingManager()
    vector_store = VectorStore()
    retriever = RAGRetrieval(vector_store, embedding_manager)
    rag = RAGLLM()

    # Index karo agar empty hai
    if vector_store.collection.count() == 0:
        documents = dir_loader_pdf.load()
        chunker = TextChunker()
        chunks = chunker.split(documents)
        texts = [chunk.page_content for chunk in chunks]
        embeddings = embedding_manager.generate_embedding(texts)
        vector_store.add_embeddings(chunks, embeddings)

    # Test
    answer = rag.ask("What are symptoms of diabetes?", retriever)
    print(answer)
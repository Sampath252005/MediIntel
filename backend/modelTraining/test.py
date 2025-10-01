import os
import glob
from dotenv import load_dotenv
from langchain_community.document_loaders import CSVLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA

load_dotenv()

# Path to all CSV files
csv_files = glob.glob("data/*.csv")

# Load all CSVs
all_documents = []
for file in csv_files:
    loader = CSVLoader(file_path=file)
    docs = loader.load()
    all_documents.extend(docs)
    
print(f"Loaded {len(all_documents)} documents from {len(csv_files)} CSV files.")

# Embeddings using Gemini
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Create vector store from all documents
vectorstore = FAISS.from_documents(all_documents, embeddings)

retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})

# LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

# RAG chain
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="map_reduce"  # or map_reduce / refine
)

# Test query
query = "Summarize all sales data across CSV files."
answer = qa.run(query)
print(answer)



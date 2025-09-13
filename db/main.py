import os
from sqlalchemy import create_engine, Column, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import datetime
import uuid
from dotenv import load_dotenv
load_dotenv()

# Load Neon Postgres URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy setup
engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# -----------------------------
# Table Definitions (ORM Models)
# -----------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # Auth0 sub
    email = Column(String, unique=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    statements = relationship("Statement", back_populates="user")


class Statement(Base):
    __tablename__ = "statements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    filename = Column(String)
    status = Column(String, default="queued")  # queued|processing|done|error
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="statements")
    transactions = relationship("Transaction", back_populates="statement")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    statement_id = Column(String, ForeignKey("statements.id"))
    date = Column(DateTime)
    description = Column(String)
    amount = Column(Float)
    category = Column(String)

    statement = relationship("Statement", back_populates="transactions")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    statement_id = Column(String, ForeignKey("statements.id"), nullable=True)
    type = Column(String)  # spending|trends|goals|taxes
    result = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


# -----------------------------
# Repository Classes
# -----------------------------

class Database:
    def __init__(self):
        self.session = SessionLocal()

    def close(self):
        self.session.close()


class UserRepository:
    def __init__(self, db: Database):
        self.db = db.session

    def get_or_create(self, auth0_id: str, email: str, name: str):
        user = self.db.query(User).filter(User.id == auth0_id).first()
        if not user:
            user = User(id=auth0_id, email=email, name=name)
            self.db.add(user)
            self.db.commit()
        return user


class StatementRepository:
    def __init__(self, db: Database):
        self.db = db.session

    def create(self, user_id: str, filename: str):
        stmt = Statement(user_id=user_id, filename=filename, status="queued")
        self.db.add(stmt)
        self.db.commit()
        return stmt

    def list_by_user(self, user_id: str):
        return self.db.query(Statement).filter(Statement.user_id == user_id).all()

    def get(self, stmt_id: str):
        return self.db.query(Statement).filter(Statement.id == stmt_id).first()


class TransactionRepository:
    def __init__(self, db: Database):
        self.db = db.session

    def add(self, statement_id: str, date, description: str, amount: float, category: str):
        txn = Transaction(
            statement_id=statement_id,
            date=date,
            description=description,
            amount=amount,
            category=category
        )
        self.db.add(txn)
        self.db.commit()
        return txn

    def list_by_statement(self, stmt_id: str):
        return self.db.query(Transaction).filter(Transaction.statement_id == stmt_id).all()


class AnalysisRepository:
    def __init__(self, db: Database):
        self.db = db.session

    def save(self, user_id: str, stmt_id: str, type: str, result: dict):
        analysis = Analysis(user_id=user_id, statement_id=stmt_id, type=type, result=result)
        self.db.add(analysis)
        self.db.commit()
        return analysis

    def latest(self, user_id: str, type: str):
        return (self.db.query(Analysis)
                .filter(Analysis.user_id == user_id, Analysis.type == type)
                .order_by(Analysis.created_at.desc())
                .first())
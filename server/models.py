from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from datetime import datetime
from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)

    # Relationships
    borrows = db.relationship('Borrow', back_populates='user', cascade='all, delete-orphan')

    # Association proxy to access books directly
    borrowed_books = association_proxy('borrows', 'book')

    # Serialization
    serialize_rules = ('-borrows.user', '-borrowed_books.borrows')
    
class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    author = db.Column(db.String(80), nullable=False)
    genre = db.Column(db.String(80))
    available_copies = db.Column(db.Integer, default=1)

    # Relationships
    borrows = db.relationship('Borrow', back_populates='book', cascade='all, delete-orphan')

    # Association proxy to access users directly
    users = association_proxy('borrows', 'user')

    # Serialization
    serialize_rules = ('-borrows.book', '-users.borrows')
    
class Borrow(db.Model, SerializerMixin):
    __tablename__ = 'borrows'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'))
    borrow_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String, default="borrowed")  # e.g., 'borrowed', 'returned'

    # Relationships
    user = db.relationship('User', back_populates='borrows')
    book = db.relationship('Book', back_populates='borrows')

    # Serialization
    serialize_rules = ('-user.borrows', '-book.borrows')

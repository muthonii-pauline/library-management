#!/usr/bin/env python3

from flask import request, render_template
from flask_restful import Resource
from datetime import datetime, timedelta
from random import randint, choice as rc
from faker import Faker

from config import app, db, api
from flask_migrate import upgrade

from models import User, Book, Borrow

fake = Faker()

# === Serializers ===

def serialize_user(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }

def serialize_book(book):
    return {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "available_copies": book.available_copies
    }

def serialize_borrow(borrow):
    return {
        "id": borrow.id,
        "user_id": borrow.user_id,
        "book_id": borrow.book_id,
        "borrow_date": borrow.borrow_date.isoformat() if borrow.borrow_date else None,
        "return_date": borrow.return_date.isoformat() if borrow.return_date else None,
        "status": borrow.status,
        "book": serialize_book(borrow.book),
        "user": serialize_user(borrow.user)
    }

# === Resource Classes ===

class UserList(Resource):
    def get(self):
        return [serialize_user(u) for u in User.query.all()], 200

    def post(self):
        data = request.get_json()
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return serialize_user(user), 201

    def put(self, id):
        user = User.query.get_or_404(id)
        data = request.get_json()
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        db.session.commit()
        return serialize_user(user), 200

    def patch(self, id):
        user = User.query.get_or_404(id)
        data = request.get_json()
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        db.session.commit()
        return serialize_user(user), 200

    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return '', 204

class BookList(Resource):
    def get(self):
        return [serialize_book(b) for b in Book.query.all()], 200

    def post(self):
        data = request.get_json()
        book = Book(**data)
        db.session.add(book)
        db.session.commit()
        return serialize_book(book), 201

    def put(self, id):
        book = Book.query.get_or_404(id)
        data = request.get_json()
        book.title = data.get('title', book.title)
        book.author = data.get('author', book.author)
        book.genre = data.get('genre', book.genre)
        book.available_copies = data.get('available_copies', book.available_copies)
        db.session.commit()
        return serialize_book(book), 200

    def patch(self, id):
        book = Book.query.get_or_404(id)
        data = request.get_json()
        if 'title' in data:
            book.title = data['title']
        if 'author' in data:
            book.author = data['author']
        if 'genre' in data:
            book.genre = data['genre']
        if 'available_copies' in data:
            book.available_copies = data['available_copies']
        db.session.commit()
        return serialize_book(book), 200

    def delete(self, id):
        book = Book.query.get_or_404(id)
        db.session.delete(book)
        db.session.commit()
        return '', 204

class BorrowList(Resource):
    def get(self):
        return [serialize_borrow(b) for b in Borrow.query.all()], 200

    def post(self):
        data = request.get_json()
        book = Book.query.get(data["book_id"])

        if book and book.available_copies > 0:
            borrow = Borrow(
                user_id=data["user_id"],
                book_id=data["book_id"],
                borrow_date=datetime.utcnow(),
                status="borrowed"
            )
            book.available_copies -= 1
            db.session.add(borrow)
            db.session.commit()
            return serialize_borrow(borrow), 201
        return {"error": "Book not available"}, 400

    def put(self, id):
        borrow = Borrow.query.get_or_404(id)
        data = request.get_json()
        borrow.status = data.get('status', borrow.status)
        borrow.return_date = datetime.fromisoformat(data['return_date']) if data.get('return_date') else borrow.return_date
        db.session.commit()
        return serialize_borrow(borrow), 200

    def patch(self, id):
        borrow = Borrow.query.get_or_404(id)
        data = request.get_json()
        if 'status' in data:
            borrow.status = data['status']
        if 'return_date' in data:
            borrow.return_date = datetime.fromisoformat(data['return_date'])
        db.session.commit()
        return serialize_borrow(borrow), 200

    def delete(self, id):
        borrow = Borrow.query.get_or_404(id)
        db.session.delete(borrow)
        db.session.commit()
        return '', 204

class BorrowReturn(Resource):
    def patch(self, id):
        borrow = Borrow.query.get_or_404(id)
        if borrow.status == "returned":
            return {"error": "Book already returned"}, 400

        borrow.status = "returned"
        borrow.return_date = datetime.utcnow()
        borrow.book.available_copies += 1
        db.session.commit()
        return serialize_borrow(borrow), 200

# === Register Routes ===

api.add_resource(UserList, '/api/users', '/api/users/<int:id>')
api.add_resource(BookList, '/api/books', '/api/books/<int:id>')
api.add_resource(BorrowList, '/api/borrows', '/api/borrows/<int:id>')
api.add_resource(BorrowReturn, '/api/borrows/<int:id>/return')

# === React catch-all and health check routes ===

@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

# === Auto migrate and seed on first request (for free tier on Render) ===

@app.before_first_request
def seed_db():
    upgrade()  # run migrations

    if User.query.first():
        return  # Already seeded

    print("Starting seed...")

    # Clear tables
    Borrow.query.delete()
    User.query.delete()
    Book.query.delete()
    db.session.commit()

    # Seed users
    users = []
    for _ in range(50):
        users.append(User(name=fake.name(), email=fake.unique.email()))
    db.session.add_all(users)
    db.session.commit()

    # Seed books
    genres = ["Mystery", "Romance", "Sci-Fi", "Fantasy", "History", "Drama"]
    books = []
    for _ in range(50):
        books.append(Book(
            title=fake.sentence(nb_words=3).rstrip('.'),
            author=fake.name(),
            genre=rc(genres),
            available_copies=randint(1, 5)
        ))
    db.session.add_all(books)
    db.session.commit()

    # Seed borrows
    borrows = []
    for _ in range(25):
        user = rc(users)
        book = rc(books)
        borrow_date = fake.date_between(start_date='-60d', end_date='today')
        status = rc(["borrowed", "returned"])
        return_date = None
        if status == "returned":
            return_date = borrow_date + timedelta(days=randint(3, 14))

        if status == "borrowed" and book.available_copies == 0:
            continue

        borrow = Borrow(
            user_id=user.id,
            book_id=book.id,
            borrow_date=borrow_date,
            return_date=return_date,
            status=status
        )
        borrows.append(borrow)

        if status == "borrowed":
            book.available_copies -= 1

    db.session.add_all(borrows)
    db.session.commit()

    print("✅ Done seeding!")

# === Local Dev ===

if __name__ == '__main__':
    app.run(port=5555, debug=True)

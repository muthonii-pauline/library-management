#!/usr/bin/env python3

from flask import request, render_template
from flask_restful import Resource
from datetime import datetime

from config import app, db, api, migrate
from models import User, Book, Borrow

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
        borrows = Borrow.query.all()
        return [serialize_borrow(b) for b in borrows], 200

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

# === Register API Resources ===

api.add_resource(UserList, '/api/users', '/api/users/<int:id>')
api.add_resource(BookList, '/api/books', '/api/books/<int:id>')
api.add_resource(BorrowList, '/api/borrows', '/api/borrows/<int:id>')
api.add_resource(BorrowReturn, '/api/borrows/<int:id>/return')

# === Catch-all routes for React frontend ===

@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

# === App Entry Point ===

if __name__ == '__main__':
    app.run(port=5555, debug=True)

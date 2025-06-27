#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Book, Borrow

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("🌱 Starting seed...")

        # Clear existing data
        print("🧹 Clearing tables...")
        Borrow.query.delete()
        User.query.delete()
        Book.query.delete()

        # Create users
        print("👤 Seeding users...")
        users = []
        for _ in range(50):
            user = User(
                name=fake.name(),
                email=fake.unique.email()
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()

        # Create books
        print("📚 Seeding books...")
        books = []
        for _ in range(50):
            book = Book(
                title=fake.sentence(nb_words=3),
                author=fake.name(),
                available_copies=randint(1, 5)
            )
            books.append(book)
        db.session.add_all(books)
        db.session.commit()

        # Create borrow records
        print("🔁 Seeding borrows...")
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

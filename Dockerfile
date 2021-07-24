FROM python:3.8

WORKDIR /app

# Install project python dependencies
ADD ["pyproject.toml", "poetry.lock", "./"]
ADD src/config.py src/config.py
RUN pip install poetry~=1.1.7 \
    && poetry config virtualenvs.in-project true \
    && poetry config virtualenvs.path .venv \
    && poetry install

ADD src src
RUN poetry install
ADD scripts scripts

CMD ["python", "--version"]

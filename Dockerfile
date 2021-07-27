FROM python:3.8

# Install SSH Server
RUN apt update && apt -y install openssh-server
RUN apt purge -y whois && apt -y autoremove && apt -y autoclean && apt -y clean

WORKDIR /app

# Node.js
RUN apt-get install -y --no-install-recommends curl \
  && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
  && apt-get install -y nodejs \

# Yarn
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update && apt-get install yarn

# Install project python dependencies
ADD ["pyproject.toml", "poetry.lock", "./"]
ADD src/config.py src/config.py
RUN pip install poetry~=1.1.7 \
    && poetry config virtualenvs.in-project true \
    && poetry config virtualenvs.path .venv \
    && poetry install

# Complile JS
WORKDIR /app/web
ADD ["web/package.json", "web/yarn.lock", "./"]
RUN yarn install
ADD web/public public
ADD web/src src
RUN yarn run build
WORKDIR /app

ADD src src
RUN poetry install
ADD scripts scripts

CMD ["python", "--version"]

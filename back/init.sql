create table "users" (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table "permissions" (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO "permissions" (id, name) VALUES ('19cba769-dd7c-4d55-b5e4-ce1b8684ae04', 'CREATE_USER');
INSERT INTO "permissions" (id, name) VALUES ('98025640-9302-451a-8c5c-40623b9d3578', 'UPDATE_USER');
INSERT INTO "permissions" (id, name) VALUES ('81fd2a87-90ae-4bbd-bb14-da3ca8cc378f', 'DELETE_USER');
INSERT INTO "permissions" (id, name) VALUES ('a1005c0b-13e0-4817-8e77-7b0e569d2c9d', 'FIND_USER');
INSERT INTO "permissions" (id, name) VALUES ('ccb4f040-27a8-438c-a870-153b8f01758d', 'FIND_MANY_USER');


create table "user_permission" (
    user_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES "users"(id),
    FOREIGN KEY (permission_id) REFERENCES "permissions"(id)
);

create table "login_auth" (
    id UUID NOT NULL,
    user_id UUID NOT NULL,
    ip VARCHAR(20) NOT NULL,
    device VARCHAR(255),
    location VARCHAR(255),
    success BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);
DEFINE TABLE IF NOT EXISTS chat
    TYPE NORMAL
    SCHEMAFULL;

DEFINE FIELD IF NOT EXISTS title
    ON TABLE chat
    TYPE string;

DEFINE FIELD IF NOT EXISTS model
    ON TABLE chat
    TYPE string;

DEFINE FIELD IF NOT EXISTS created_at
    ON TABLE chat
    TYPE datetime
    DEFAULT time::now();

DEFINE FIELD IF NOT EXISTS updated_at
    ON TABLE chat
    TYPE datetime
    DEFAULT time::now();


DEFINE TABLE IF NOT EXISTS message
    TYPE NORMAL
    SCHEMAFULL;

DEFINE FIELD IF NOT EXISTS chat
    ON TABLE message
    TYPE record<chat>;

DEFINE FIELD IF NOT EXISTS role
    ON TABLE message
    TYPE string
    ASSERT $value IN ["user", "assistant"];

DEFINE FIELD IF NOT EXISTS content
    ON TABLE message
    TYPE string;

DEFINE FIELD IF NOT EXISTS created_at
    ON TABLE message
    TYPE datetime
    DEFAULT time::now();
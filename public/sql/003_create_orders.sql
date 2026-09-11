CREATE TABLE orders (
    id VARCHAR(36) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
    id VARCHAR(36) NOT NULL UNIQUE,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,

    CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products (id)
);
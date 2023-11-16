-- CreateTable
CREATE TABLE `owners` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `gender` BOOLEAN NULL,
    `birth_year` SMALLINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_owners` (
    `product_id` BIGINT NOT NULL,
    `owner_id` BIGINT NOT NULL,

    PRIMARY KEY (`product_id`, `owner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` BIGINT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `type` ENUM('Snack', 'Peralatan', 'Minuman', 'Hampers', 'Selempang', 'Bouquet') NOT NULL,
    `stocked_at` DATETIME(0) NOT NULL,
    `stock` INTEGER NULL DEFAULT 0,
    `price` DECIMAL(15, 2) NULL DEFAULT 0.00,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `quality` TINYINT NOT NULL,
    `ordered_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `orders_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ratings` (
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `score` TINYINT NOT NULL,
    `rated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uniq_product_user_idx`(`product_id`, `user_id`),
    PRIMARY KEY (`product_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL,
    `balance` DECIMAL(15, 2) NULL DEFAULT 0.0,
    `nickname` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `nickname`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

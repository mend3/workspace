# Use the official PHP image AS the base image
FROM php:8.3-apache AS base

# Install required PHP extensions
RUN docker-php-ext-install mysqli \
    && docker-php-ext-enable mysqli

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]


FROM base AS phpbb

RUN apt update && apt install zip unzip -y

# Download and extract phpBB
RUN curl -sL https://download.phpbb.com/pub/release/3.3/3.3.12/phpBB-3.3.12.zip -o phpBB.zip && \
    unzip phpBB.zip -d /usr/src && \
    mv /usr/src/phpBB3/* . && \
    rm phpBB.zip && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Start Apache server
CMD ["apache2-foreground"]
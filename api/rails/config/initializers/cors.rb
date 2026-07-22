# Be sure to restart your server when you modify this file.

# Restricted CORS for the Vite client. Never use wildcard origins.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173"

    resource "*",
      headers: :any,
      methods: %i[get patch options head],
      expose: %w[Content-Type]
  end
end

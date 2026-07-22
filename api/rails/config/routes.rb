Rails.application.routes.draw do
  resources :candidates, only: %i[index show update]

  get "up" => "rails/health#show", as: :rails_health_check
end

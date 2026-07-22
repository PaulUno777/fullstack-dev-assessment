Rails.application.routes.draw do
  resources :candidates, only: %i[index show update] do
    collection do
      patch :bulk
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end

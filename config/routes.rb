Rails.application.routes.draw do
  root 'light_effects#new'
  devise_for :users
  resources :light_effects, only: [:index, :new, :create, :show, :destroy, :update]
  resources :light_shows, only: [:index, :new, :create] do
    resources :light_sequences, only: [:index, :create]
  end
  resources :light_sequences, only: [:update, :destroy]
end

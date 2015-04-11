Rails.application.routes.draw do
  root 'light_effects#new'
  devise_for :users
  resources :light_effects, only: [:index, :new, :create, :show, :destroy, :update]
  resources :light_shows, only: [:index, :new, :create]
end

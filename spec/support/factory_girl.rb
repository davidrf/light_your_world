require 'factory_girl'

FactoryGirl.define do
  factory :user do
    sequence(:email) {|n| "user#{n}@example.com" }
    password 'password'
    password_confirmation 'password'
    bridge_url ENV['BRIDGE_URL']
  end

  factory :light_effect do
    name "Test Light Effect"
    hue "65000"
    on true
    brightness 200
    saturation 200
    transition_time 10
    user
  end

  factory :light_show do
    name "Sweet Light Show"
  end
end

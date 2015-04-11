require 'rails_helper'

RSpec.describe User, type: :model do
  it { should have_many :light_effects }

  it { should have_valid(:email).when("dabomb@gmail.com", "hi@yahoo.com") }
  it { should_not have_valid(:email).when(
    nil, "", "dabomb", "dabomb@", "dabomb@gmail", "@gmail.com", ".com"
  )}

  it { should have_valid(:password).when("password") }
  it { should_not have_valid(:password).when(nil, "") }

  it { should have_valid(:bridge_url).when("12.34.56.789") }
  it { should_not have_valid(:bridge_url).when(nil, "") }
end

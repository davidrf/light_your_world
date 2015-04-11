require 'rails_helper'

feature 'user adds a new light show', %{
  As a user,
  I want to add a new light show
  So that I can add new light sequences
} do
  #   Acceptance Criteria
  #   - I must be signed in
  # 	- I must provide a name, light, light effect, and time
  # 	- I must be presented with errors if I fill out the form incorrectly

  scenario 'added successfully' do
    user = FactoryGirl.create(:user)
    light_show = FactoryGirl.build(:light_show)

    visit root_path
    sign_in_as(user)
    click_link 'Light Shows'
    fill_in 'light-show-name', with: light_show.name
    click_button "Add Light Show"

    expect(page).to have_content("Light Show Added!")
    expect(page).to have_content(light_show.name)
  end
end

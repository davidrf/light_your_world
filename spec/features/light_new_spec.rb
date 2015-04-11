# require 'rails_helper'
#
# feature 'user adds a new light effect', %{
#   As a user,
#   I want to add a new light effect
#   So that I light
# } do
#   #   Acceptance Criteria
#   #   - I must be signed in
#   # 	- I must provide a name
#   # 	- I must be presented with errors if I fill out the form incorrectly
#
#   scenario 'added successfully' do
#     light_effect = FactoryGirl.build(:light_effect)
#     user = FactoryGirl.create(:user)
#
#     visit root_path
#     sign_in_as(user)
#
#     fill_in 'Name', with: light_effect.name
#     fill_in 'Hue', with: light_effect.hue
#     find(:xpath, "//input[@id='brightness']").set light_effect.brightness
#     find(:xpath, "//input[@id='saturation']").set light_effect.saturation
#     find(:xpath, "//input[@id='transition_time']").set light_effect.transition_time
#     check 'On'
#     click_button 'Add Light Effect'
#
#     expect(page).to have_content("Light Effect Added!")
#     expect(page).to have_content(light_effect.name)
#   end
# end

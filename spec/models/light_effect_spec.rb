require 'rails_helper'

RSpec.describe LightEffect, type: :model do
  it { should belong_to :user }

  it { should have_valid(:name).when("Blue", "Orange") }
  it { should_not have_valid(:name).when(nil, "") }

  it { should have_valid(:hue).when("0", 0, 25000, 65535) }
  it { should_not have_valid(:hue).when(nil, "", -1, 0.1, 65536) }

  it { should have_valid(:brightness).when("1", 1, 100, 254) }
  it { should_not have_valid(:brightness).when(nil, "", 0, 0.1, 255) }

  it { should have_valid(:saturation).when("0", 0, 100, 254) }
  it { should_not have_valid(:saturation).when(nil, "", -1, 0.1, 255) }

  it { should have_valid(:transition_time).when("0", 0, 50, 100) }
  it { should_not have_valid(:transition_time).when(nil, "", -1, 0.1, 101) }

  it { should have_valid(:on).when(0, 1, "0", "1") }
  it { should_not have_valid(:on).when("", nil) }

  it { should have_valid(:user).when(User.new) }
  it { should_not have_valid(:user).when(nil) }
end

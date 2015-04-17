class LightSequence < ActiveRecord::Base
  belongs_to :light_effect
  belongs_to :light_show

  validates :scheduled_time, numericality: {
    greater_than_or_equal_to: 0
  }
  validates :transition_time, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 100
  }
  validates :on, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 1
  }
  validates :light_id, presence: true
  validates :light_effect_id, presence: true
  validates :light_show_id, presence: true

  def power
    on == 1  ? "On" : "Off"
  end
end

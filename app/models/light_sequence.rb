class LightSequence < ActiveRecord::Base
  belongs_to :light_effect
  belongs_to :light_show

  validates :milliseconds, numericality: true
  validates :light_id, presence: true
  validates :light_effect_id, presence: true
  validates :light_show_id, presence: true
end

class LightShow < ActiveRecord::Base
  belongs_to :user
  has_many :light_sequences
  has_many :light_effects, through: :light_sequences

  validates :name, presence: true
  validates :user, presence: true
end

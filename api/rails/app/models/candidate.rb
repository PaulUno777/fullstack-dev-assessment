class Candidate < ApplicationRecord
  STATUSES = %w[pending accepted rejected].freeze

  validates :status, inclusion: { in: STATUSES }
end

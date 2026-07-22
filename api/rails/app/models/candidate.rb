class Candidate < ApplicationRecord
  STATUSES = %w[pending accepted rejected].freeze
  SORTABLE = %w[status date_applied].freeze

  validates :status, inclusion: { in: STATUSES }

  scope :by_status, ->(status) {
    status.present? ? where(status: status) : all
  }

  scope :search_name, ->(query) {
    query.present? ? where("LOWER(name) LIKE ?", "%#{query.to_s.downcase}%") : all
  }

  scope :sorted_by, ->(sort, direction) {
    column = SORTABLE.include?(sort.to_s) ? sort.to_s : "date_applied"
    dir = direction.to_s.downcase == "asc" ? "ASC" : "DESC"
    order(Arel.sql("#{column} #{dir}"))
  }
end

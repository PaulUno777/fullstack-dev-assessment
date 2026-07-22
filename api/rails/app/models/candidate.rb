class Candidate < ApplicationRecord
  STATUSES = %w[pending accepted rejected].freeze
  SORTABLE = %w[status date_applied].freeze

  validates :status, inclusion: { in: STATUSES }

  # Accepts a single status, CSV (`pending,accepted`), or an array.
  scope :by_status, ->(raw) {
    return all if raw.blank?

    statuses = Array(raw)
      .flat_map { |value| value.to_s.split(",") }
      .map(&:strip)
      .reject(&:blank?)
      .select { |value| STATUSES.include?(value) }
      .uniq

    statuses.empty? ? none : where(status: statuses)
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

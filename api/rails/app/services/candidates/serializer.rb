# frozen_string_literal: true

module Candidates
  class Serializer
    def self.one(candidate)
      {
        id: candidate.id,
        name: candidate.name,
        years_exp: candidate.years_exp,
        status: candidate.status,
        date_applied: candidate.date_applied,
        reviewed: candidate.reviewed,
        description: candidate.description,
        created_at: candidate.created_at,
        updated_at: candidate.updated_at
      }
    end

    def self.many(candidates)
      candidates.map { |candidate| one(candidate) }
    end
  end
end

# frozen_string_literal: true

module Candidates
  class BulkUpdateStatus
    Result = Struct.new(:updated, :errors, keyword_init: true)
    Error = Struct.new(:id, :code, keyword_init: true)

    def self.call(ids:, status:)
      new(ids: ids, status: status).call
    end

    def initialize(ids:, status:)
      @ids = Array(ids).map(&:to_i).uniq
      @status = status
    end

    def call
      updated = []
      errors = []

      @ids.each do |id|
        candidate = Candidate.find_by(id: id)
        unless candidate
          errors << Error.new(id: id, code: "not_found")
          next
        end

        result = UpdateStatus.call(candidate: candidate, status: @status)
        if result.ok?
          updated << result.candidate
        else
          errors << Error.new(id: id, code: result.error_code)
        end
      end

      Result.new(updated: updated, errors: errors)
    end
  end
end

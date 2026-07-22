# frozen_string_literal: true

module Candidates
  class UpdateStatus
    Result = Struct.new(:ok?, :candidate, :error_code, keyword_init: true)

    def self.call(candidate:, status:)
      new(candidate: candidate, status: status).call
    end

    def initialize(candidate:, status:)
      @candidate = candidate
      @status = status
    end

    def call
      policy = StatusPolicy.apply(current_status: @candidate.status, new_status: @status)
      return Result.new(ok?: false, candidate: @candidate, error_code: policy.error_code) unless policy.ok?

      @candidate.status = @status
      @candidate.reviewed = true
      @candidate.save!

      Result.new(ok?: true, candidate: @candidate, error_code: nil)
    end
  end
end

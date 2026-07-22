# frozen_string_literal: true

module Candidates
  class MarkReviewed
    Result = Struct.new(:ok?, :candidate, :error_code, keyword_init: true)

    def self.call(candidate:)
      new(candidate: candidate).call
    end

    def initialize(candidate:)
      @candidate = candidate
    end

    def call
      return Result.new(ok?: true, candidate: @candidate, error_code: nil) if @candidate.reviewed

      @candidate.reviewed = true
      @candidate.save!

      Result.new(ok?: true, candidate: @candidate, error_code: nil)
    end
  end
end
